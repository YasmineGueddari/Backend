import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';


import { AuthCredentialsDto } from 'src/common/dtos/auth-credentials.dto';
import { SingCredentialsDto } from 'src/common/dtos/signin-credentials.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { User } from 'src/enteties/user.entity';
import { ChangePasswordDto } from 'src/common/dtos/ChangePassword.dto';
import { Role } from 'src/common/enum/role.enum';
import { FileService } from 'src/file/file.service';




@Injectable()
export class userService {
    private logger = new Logger('AuthService') 

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService:JwtService,
        private mailerService: MailerService,
        private fileService: FileService
      ){}

//Sign up 
      async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { email, password, firstName, lastName, phone } = authCredentialsDto;
      
        const user = new User();
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
      
        try {
          await user.save();
          return user; 
        } catch (error) {
          if (error.code === '23505') { // Duplicate username error code
            throw new ConflictException('Email already exists');
          } else {
            throw new InternalServerErrorException('Failed to register user');
          }
        }
      }

     
 //Sign in

    async signIn(authCredentialsDto: SingCredentialsDto): Promise<{ accessToken: string, id: number, firstName: string, lastName: string, role: string, image:string }> {
      // Validez les identifiants de l'utilisateur
      const email = await this.ValidateUserPassword(authCredentialsDto);
      
      if (!email) {
          throw new UnauthorizedException('Invalid credentials');
      }
  
      // Récupérez l'utilisateur depuis la base de données
      const user = await this.userRepository.findOne({
          where: {
              email: authCredentialsDto.email,
          },
      });
      
      // Générez le JWT
      const payload: JwtPayload = {
          email: user.email,
      };
      const accessToken = await this.jwtService.sign(payload);
      
      // Retournez le jeton d'accès et les détails de l'utilisateur
      return { accessToken, id: user.id, firstName: user.firstName, lastName: user.lastName, role: user.role, image: user.image };
  }
  
   //validate password then we used in the method signIn 
    async ValidateUserPassword(authCredantialsDto:SingCredentialsDto):Promise<string>{
        const {email, password}= authCredantialsDto;
        const user=await this.userRepository.findOne({
            where: {  email }
        });

        if (user && await user.validatePassword(password)){
            return user.email;
            
        }
        else { 
            return null
        }
    }

    
    //hash password
    private async hashPassword(password:string,salt:string):Promise<string>{
        return bcrypt.hash(password,salt);
    }
  

    
   //change Password
    async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
      const { currentPassword, newPassword } = changePasswordDto;
      const user = await this.userRepository.findOne({ where: { id } }); // Utilisez l'option where pour rechercher par ID

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Vérifiez si le mot de passe actuel correspond
      const isMatch = await user.validatePassword(currentPassword);
      if (!isMatch) {
        throw new Error('Invalid current password');
      }

      // Changez le mot de passe
      user.password = await this.hashPassword(newPassword, user.salt);
      await user.save();

      return { message: 'Password updated successfully' };
}




      // Réinitialisation du mot de passe et envoi par e-mail
      async resetPassword(email: string): Promise<string> {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
          throw new NotFoundException('User not found');
      }

      // Générer un nouveau mot de passe aléatoire
      const newPassword = this.generateRandomPassword();

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe de l'utilisateur dans la base de données
      user.password = hashedPassword;
      await this.userRepository.save(user);

      // Envoyer le nouveau mot de passe par e-mail
      await this.sendPasswordResetEmail(user.email, newPassword);

      // Retourner le nouveau mot de passe
      return newPassword;
    }


      // Méthode privée pour envoyer l'e-mail de réinitialisation du mot de passe
      private async sendPasswordResetEmail(email: string, newPassword: string): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Password Reset Request',
                template: 'password-reset', // Modèle de courrier électronique à utiliser
                context: {
                    newPassword, 
                },
            });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
      }

      // Méthode pour générer un mot de passe aléatoire
      private generateRandomPassword(length: number = 10): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return newPassword;
      }


      

//CRUD

async create(authCredentialsDto: AuthCredentialsDto, imageFile: Express.Multer.File): Promise<User> {
  const { email, password, firstName, lastName, phone, role } = authCredentialsDto; // Assurez-vous que le rôle est inclus dans le DTO

  const user = new User();
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  user.phone = phone;
  user.role = role; // Affectez le rôle à partir du DTO

  user.salt = await bcrypt.genSalt();
  user.password = await this.hashPassword(password, user.salt);
  
  if (imageFile) {
    const imagePath = await this.fileService.saveFile(imageFile);
    user.image = imagePath;
  }

  try {
    await user.save();
    return user;
  } catch (error) {
    if (error.code === '23505') {
      throw new ConflictException('Email already exists');
    } else {
      throw new InternalServerErrorException('Failed to register user');
    }
  }
}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } }) ;
  }

  async update(id: number, updateUserDto: AuthCredentialsDto) {

    const user = await this.findOne(id);

    if(!user) {
      throw new NotFoundException();
    }
    Object.assign(user,updateUserDto);

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if(!user) {
      throw new NotFoundException();
    }
   
    return await this.userRepository.remove(user);
  }



}
