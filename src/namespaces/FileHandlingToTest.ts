import FileHandling from "./FileHandling";

type MyContext = any;
const ctx:MyContext = {
    from: {id: 1502217517, first_name: "Obed"},
    reply: (rep:any)=>(rep),
    replyWithMediaGroup: async (arr:any)=>(arr),
    getFile: ()=>({
        getUrl:()=>("this is a url"),
        file_path: "path/to/file",
        download: (path:any)=>(path)
    })
}

export const fileHandle = new FileHandling.FileHandle({ctx, isUrl:false, path:"\\tmp\\assets"});