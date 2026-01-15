import Clock from "./clock.svg";
import Home from "./home.svg";
import Logo from "./logo.svg";
import Messages from "./messages.svg";
import Products from "./products.svg";
import Settings from "./settings.svg";
import Statistics from "./statistics.svg";
import Close from "./close.svg";
import Complete from "./complete.svg";
import Filter from "./filter.svg";
import Etc from "./etc.svg";
import Micro from "./micro.svg";
import Screpka from "./screpka.svg";
import SendMail from "./sendMail.svg";

export const icons = {
  clock: Clock,
  home: Home,
  logo: Logo,
  messages: Messages,
  products: Products,
  settings: Settings,
  statistics: Statistics,
  close: Close,
  complete: Complete,
  filter: Filter,
  etc: Etc,
  micro: Micro,
  screpka: Screpka,
  sendMail: SendMail,
};

export type IconName = keyof typeof icons;
