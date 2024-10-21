// @ts-nocheck
import type { WifiNetwork, FileSystemNode } from "@/types";
import { assignIds } from "~/helpers";

export const defaultNetworks: WifiNetwork[] = [
  { id: 1, name: "FASTWEB-7632798", signal: 4, isProtected: true },
  { id: 2, name: "TIM-1234567", signal: 3, isProtected: true },
  { id: 3, name: "ILIAD-34781 Public", signal: 1, isProtected: false },
];

export const defaultFileSystem = (username: string): FileSystemNode =>
  assignIds({
    name: "/",
    type: "folder",
    canMove: false,
    canDelete: false,
    icon: "folder:folder",
    children: [
      {
        name: "home",
        type: "folder",
        canMove: false,
        canDelete: false,
        icon: "folder:folder",
        children: [
          {
            name: username,
            type: "folder",
            canMove: false,
            canDelete: false,
            icon: "folder:folder",
            children: [
              {
                name: "Downloads",
                type: "folder",
                icon: "folder:folder",
                children: [],
              },
              {
                name: "Documents",
                type: "folder",
                icon: "folder:folder",
                children: [],
              },
              {
                name: "Pictures",
                type: "folder",
                icon: "folder:folder",
                children: [],
              },
              {
                name: "Music",
                type: "folder",
                icon: "folder:folder",
                children: [],
              },
              {
                name: "Videos",
                type: "folder",
                icon: "folder:folder",
                children: [],
              },
              {
                name: "Desktop",
                type: "folder",
                icon: "folder:folder",
                canMove: false,
                canDelete: false,
                children: [
                  {
                    name: "Trash",
                    type: "app",
                    canMove: false,
                    canDelete: false,
                    icon: "app:trash",
                    children: [],
                  },
                ],
              },
              {
                name: ".zshrc",
                type: "file",
                icon: "file:text",
              },
            ],
          },
        ],
      },
      {
        name: "bin",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "etc",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "proc",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "run",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "usr",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "var",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
      {
        name: "tmp",
        type: "folder",
        icon: "folder:folder",
        children: [],
      },
    ],
  });
