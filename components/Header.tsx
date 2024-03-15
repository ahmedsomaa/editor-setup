import Logo from "./Logo";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <nav className="w-full flex justify-center h-16">
      <div className="w-full  flex justify-between items-center text-sm text-foreground">
        <Logo color="text-[#007ACC]" />
        <Button asChild size="default">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/ahmedsomaa/theme-font-pair/issues/new"
          >
            Submit
          </a>
        </Button>
      </div>
    </nav>
  );
}
