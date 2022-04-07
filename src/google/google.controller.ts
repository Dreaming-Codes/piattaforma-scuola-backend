import {Controller, Get, Req, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {Request, Response} from "express";
import {JwtGuard} from "./jwt.guard";
import {GoogleGuard} from "./google.guard";

@Controller('google')
export class GoogleController {
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log("GOOGLE LOGIN")
  }

  @Get('redirect')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    if(req.user) {
      res.redirect(`${process.env.FRONTEND_URL}/authComplete?token=${req.user}`)
    }else{
      res.redirect(`${process.env.FRONTEND_URL}/authFailed`)
    }
  }

  @Get('isAuthenticated')
  @UseGuards(JwtGuard)
  async isAuthenticated(@Req() req: Request, @Res() res: Response) {
    res.status(200);
    res.end();
  }
}
