declare module "editor-setup" {
  export type Entry = {
    name: string;
    url: string;
  };

  export type Pair = {
    id: string;
    font: Entry;
    theme: Entry;
    image: string;
  };
}
