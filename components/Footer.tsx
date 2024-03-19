"use client";

import React from "react";

import { cn } from "@/lib/utils";
import Github from "./icons/Github";
import Twitter from "./icons/Twitter";

interface FooterProps {
  bgColor?: string;
  iconColor?: string;
}

const Footer = ({ bgColor, iconColor }: FooterProps) => {
  return (
    <footer
      className={cn(
        "p-4 bg-[#007ACC] border-t flex items-center justify-center",
        bgColor
      )}
    >
      <div className="max-w-4xl w-full flex">
        <div className="flex flex-row justify-between items-center w-full">
          <p className={cn("text-sm leading-5 text-white", iconColor)}>
            © Copyright {new Date().getFullYear()} EditorSetup.
          </p>
          <div className="flex flex-row space-x-4 items-center">
            <a href="https://github.com/ahmedsomaa" target="_blank">
              <Github
                className={cn(
                  "text-slate-100 hover:text-slate-100/90",
                  iconColor
                )}
              />
            </a>
            <a href="https://twitter.com/abokahfa" target="_blank">
              <Twitter
                className={cn(
                  "text-slate-100 hover:text-slate-100/90",
                  iconColor
                )}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
