import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from 'src/common/dtos/auth-credentials.dto';
import { SingCredentialsDto } from 'src/common/dtos/signin-credentials.dto';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { User } from 'src/enteties/user.entity';
import { ChangePasswordDto } from 'src/common/dtos/ChangePassword.dto';
import { FileService } from 'src/file/file.service';
import { Succursale } from 'src/enteties/succursale.entity';
import { MailerService } from '@nestjs-modules/mailer';





@Injectable()
export class userService {
    private logger = new Logger('AuthService') 

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Succursale) // Ajoutez cette ligne pour injecter le repository de Succursale
        private succursaleRepository: Repository<Succursale>, // Assurez-vous d'importer la classe Succursale
        
        private jwtService:JwtService,
        private mailerService: MailerService,
        private fileService: FileService,
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



     
 
 // SignIn method
async signIn(authCredentialsDto: SingCredentialsDto): Promise<{ accessToken: string, id: number, firstName: string, lastName: string, role: string, image: string, idSuccursale: number | null }> {
  // Validate user credentials
  const email = await this.ValidateUserPassword(authCredentialsDto);

  if (!email) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Retrieve user from the database
  const user = await this.userRepository.findOne({
    where: { email: authCredentialsDto.email },
    relations: ['succursales'], // Load related entities
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Generate JWT
  const payload: JwtPayload = {
    email: user.email,
  };
  const accessToken = await this.jwtService.sign(payload, { expiresIn: '2h' });
  const currentDate = new Date();


  // Return access token and user details
  const idSuccursale = user.succursales.length > 0 ? user.succursales[0].id : null;
  return { 
    accessToken, 
    id: user.id, 
    firstName: user.firstName, 
    lastName: user.lastName, 
    role: user.role, 
    image: user.image, 
    idSuccursale 
  };
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



 // Send password reset link
 async sendPasswordResetLink(email: string): Promise<void> {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const token = this.jwtService.sign({ email }, { expiresIn: '2h' });
  const resetLink = `http://localhost:4200/set-new-password?token=${token}`;

  await this.mailerService.sendMail({
    to: email,
    subject: 'Password Reset Request',
    template: './reset-password',
    context: { resetLink },
  });
}




// Set new password
async setNewPassword(token: string, password: string): Promise<{ message: string }> {
  try {
    const decoded = this.jwtService.verify(token);
    const email = decoded.email;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await this.hashPassword(password, salt);
    user.password = hashedPassword;
    user.salt = salt; // Store the salt

    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
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

      

//CRUD
async create(authCredentialsDto: AuthCredentialsDto, imageFile: Express.Multer.File, idSuccursales: number[]): Promise<User> {
  const { email, password, firstName, lastName, phone, role, isActive } = authCredentialsDto;

  const user = new User();
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  user.phone = phone;
  user.role = role;
  user.isActive = isActive;

  user.salt = await bcrypt.genSalt();
  user.password = await this.hashPassword(password, user.salt);

  if (imageFile) {
    const imagePath = await this.fileService.saveFile(imageFile);
    user.image = imagePath;
  }

  try {
    const succursales = await this.succursaleRepository.findByIds(idSuccursales);
    if (!succursales || succursales.length !== idSuccursales.length) {
      throw new NotFoundException(`One or more succursales not found`);
    }
    user.succursales = succursales;
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



async findAll(): Promise<User[]> {
  // Récupérer tous les utilisateurs avec leurs relations succursales
  const users = await this.userRepository.find({ relations: ['succursales'] });
  return users;
}

  async findOne(id: number): Promise<User> {
    // Récupérer l'utilisateur depuis la base de données
    const user = await this.userRepository.findOne({
        where: { id },
        relations: ['succursales'], // Charger les relations succursales
    });

    // Vérifiez si l'utilisateur existe
    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Retournez l'utilisateur
    return user;
}
  



async update(id: number, updateUserDto: AuthCredentialsDto, image: Express.Multer.File, idSuccursales: number[]): Promise<User> {
  const { email, password, firstName, lastName, phone, role } = updateUserDto;

  try {
    // Trouver l'utilisateur à mettre à jour
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Mettre à jour les champs avec les nouvelles valeurs
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.role = role;

    // Vérifier si un nouveau mot de passe est fourni et le mettre à jour
    if (password) {
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, user.salt);
    }

    // Vérifier si une nouvelle image est fournie et la mettre à jour
    if (image) {
      const imagePath = await this.fileService.saveFile(image);
      user.image = imagePath;
    }

    // Trouver les succursales correspondant aux ID fournis
    const succursales = await this.succursaleRepository.findByIds(idSuccursales);
    if (!succursales || succursales.length !== idSuccursales.length) {
      throw new NotFoundException(`One or more succursales not found`);
    }
    
    // Mettre à jour la liste des succursales de l'utilisateur
    user.succursales = succursales;

    // Enregistrer les modifications dans la base de données
    await user.save();
    return user;
  } catch (error) {
    if (error.code === '23505') {
      throw new ConflictException('Email already exists');
    } else {
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}




  async remove(id: number) {
    const user = await this.findOne(id);
    if(!user) {
      throw new NotFoundException();
    }
   
    return await this.userRepository.remove(user);
  }


  // Méthode pour désactiver un User
  async disableUser(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User introuvable');
    }
    user.isActive = false;

    await this.userRepository.save(user);
  }


 // Méthode pour reactivate un User
  async reactivateUser(id: number): Promise<any> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = true;

     await this.userRepository.save(user);
    }


  }

