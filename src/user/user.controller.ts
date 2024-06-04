import { Body, Controller, Inject, Post, Get, ValidationPipe, UseInterceptors, UploadedFile, Res, Query, Delete, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { userService } from './user.service';
import { AuthCredentialsDto } from 'src/common/dtos/auth-credentials.dto';
import { SingCredentialsDto } from 'src/common/dtos/signin-credentials.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureBlobService } from 'src/Azure_Services/azure-blob.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ChangePasswordDto } from 'src/common/dtos/ChangePassword.dto';




@Controller('user')
export class userController {
    containerName = "nestapplicationtest";
    constructor( 
        @Inject(userService)
        private authService: userService,
        private readonly azureBlobService: AzureBlobService,
    ){}

    // Method for user sign-up
    @Public()
    @Post('/signup')
    async signUp(@Body(ValidationPipe) authCredantialsDto:AuthCredentialsDto){
        return await this.authService.signUp(authCredantialsDto)
    }

    // Method for user sign-in
      @Public()    
      @Post('/signin')
      async signIn(@Body(ValidationPipe) authCredentialsDto: SingCredentialsDto): Promise<{ accessToken: string, id: number, firstName: string, lastName: string, role: string, image: string,}> {
          const { accessToken, id, firstName, lastName, role, image } = await this.authService.signIn(authCredentialsDto);
          return { accessToken, id, firstName, lastName, role, image };
      }


  
    // Method for change password
    @Post(':id/change-password')
    async changePassword(@Param('id', ParseIntPipe) id: number, @Body() changePasswordDto: ChangePasswordDto) {
      return this.authService.changePassword(id, changePasswordDto);
    }

    // Method for change password
    @Public()    
    @Post('reset-password')
    async resetPassword(@Body('email') email: string): Promise<void> {
      await this.authService.resetPassword(email);
    }


    // Method to upload file to Azure Blob Storage
    @Post('upload')
    @UseInterceptors(FileInterceptor('myfile'))
    async upload(@UploadedFile() file: Express.Multer.File): Promise<string> {
      const fileUploaded= this.azureBlobService.upload(file,this.containerName);
      return fileUploaded;
    }

    // Method to retrieve file from Azure Blob Storage
    @Get('read')
    async readFile(@Res() res,@Query('filename') filename){
      const file = await this.azureBlobService.getfile(filename,this.containerName);
      return file.pipe(res);
    }

    // Method to delete file from Azure Blob Storage
    @Delete('delete')
    async DeleteFile(@Query('filename') filename){
        await this.azureBlobService.deletefile(filename,this.containerName);
        return { message: 'File deleted successfully' };
    }






    //CRUD
    @Post()
    @UseInterceptors(FileInterceptor('image')) // 'image' est le nom du champ de fichier dans le formulaire
     async create(@Body() createUserDto: AuthCredentialsDto, @UploadedFile() image: Express.Multer.File) {
    return this.authService.create(createUserDto, image);
  }
  
    @Get()
    findAll() {
      return this.authService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.authService.findOne(+id);
    }
  
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image')) // Utilisez le nom du champ de fichier approprié ici
    async updateUser(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUserDto: AuthCredentialsDto,
  ) {
    return this.authService.update(id, updateUserDto, image);
  }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.authService.remove(+id);
    }
}
