import { Button } from "@/components/ui/button";
import Logo from "../app/(marketing)/_components/Logo";
import Link from "next/link";
import { Github, Link2, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <div
      className="flex items-center w-full p-6 bg-background absolute 
      bottom-0 left-0 z-[99999] dark:bg-[#1F1F1F]">
      <Link href="/">
        <Logo />
      </Link>
      <div
        className="md:ml-auto w-full justify-between md:justify-end
        flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm" className="rounded-full">
          <Link target="_blank" href="https://www.linkedin.com/in/shaycohenn1/">
            <Linkedin />
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full">
          <Link target="_blank" href="https://github.com/ShayCohenn">
            <Github />
          </Link>
        </Button>
        <Button variant="ghost" size="sm">
          <Link
            target="_blank"
            href="https://portfolio-five-chi-95.vercel.app/"
            className="flex">
            <Link2 className="mr-2 rotate-45" />
            My Website
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Footer;
