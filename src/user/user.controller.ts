import { Body, Controller, Inject, Post, Get, ValidationPipe, UseInterceptors, UploadedFile, Query, Delete, Param, Patch, InternalServerErrorException, Put, ParseArrayPipe, UseGuards, BadRequestException } from '@nestjs/common';
import { userService } from './user.service';
import { AuthCredentialsDto } from 'src/common/dtos/auth-credentials.dto';
import { SingCredentialsDto } from 'src/common/dtos/signin-credentials.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from 'src/common/dtos/ChangePassword.dto';
import { User } from 'src/enteties/user.entity';


@ApiTags('Backoffice user')
@Controller('user')
export class userController {
  constructor(
    @Inject(userService)
    private authService: userService,
  ) {}

  @Public()
  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Public()
  @Post('/signin')
  async signIn(@Body(ValidationPipe) authCredentialsDto: SingCredentialsDto) {
    console.log('SignIn called with:', authCredentialsDto);
    return await this.authService.signIn(authCredentialsDto);
  }

  @Public()
  @Post('/reset-password')
  async sendPasswordResetLink(@Body('email') email: string): Promise<void> {
    await this.authService.sendPasswordResetLink(email);
  }

  @Public()
  @Post('/set-new-password')
  async setNewPassword(@Body('token') token: string, @Body('password') password: string): Promise<void> {
    await this.authService.setNewPassword(token, password);
  }
  

  @Post(':id/change-password')
  async changePassword(@Param('id') id: number, @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,) {
    return await this.authService.changePassword(id, changePasswordDto);
  }



  //CRUD

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() imageFile: Express.Multer.File,
    @Body('idSuccursales', new ParseArrayPipe({ items: Number })) idSuccursales: number[],
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<User> {
    if (!idSuccursales || idSuccursales.length === 0) {
      throw new BadRequestException('Succursales IDs are required');
    }
    return this.authService.create(authCredentialsDto, imageFile, idSuccursales);
  }


 
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.authService.findOne(+id);
  }


  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body('idSuccursales', new ParseArrayPipe({ items: Number })) idSuccursales: number[],
    @Body() updateUserDto: AuthCredentialsDto
  ): Promise<User> {
    if (!idSuccursales || idSuccursales.length === 0) {
      throw new BadRequestException('Succursales IDs are required');
    }
    return this.authService.update(+id, updateUserDto, image, idSuccursales);
  }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.authService.remove(+id);
    }
    
   
    @Delete(':id/disable')
    async disableUser(@Param('id') id: number) { 
      try {
        await this.authService.disableUser(id);
        return { message: 'User désactivée avec succès' };
      } catch (error) {
        console.error('Erreur lors de la désactivation de User :', error);
        throw new InternalServerErrorException('Erreur interne du serveur');
      }
    }
  
   
    @Put(':id/reactivate')
    async reactivateUser(@Param('id') id: number) {
      try {
        await this.authService.reactivateUser(id);
        return { message: 'User  reactivate avec succès' };
      } catch (error) {
        console.error('Erreur lors de la  reactivate de User :', error);
        throw new InternalServerErrorException('Erreur interne du serveur');
      }
    }
}
