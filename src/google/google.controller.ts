import {Controller, Get, Req, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {GoogleService} from "./google.service";

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log("GOOGLE LOGIN")
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    this.googleService.googleLogin(req)
    res.redirect('https://localhost/authComplete')
  }
}
