import fs from 'fs';
namespace FileHandling{

    export interface iFileHandle<T>{
        ctx: T;
        isUrl?: boolean;
        path?: string;
    }

    interface iFileHandleImpl extends iFileHandle<any>{
        editPath: (path:string)=>string;
        downloadFile: ()=>any;
    }
    
    export class FileHandle implements iFileHandle<any>{
        public ctx:any;
        public isUrl:boolean;
        public path:string;

        constructor({ctx, isUrl=false, path=""}){
            this.ctx = ctx;
            this.isUrl = isUrl;
            this.path = path;
        }
    
        public async downloadFile(){
    
            try{
                if(this.isUrl){// return the telegram url to the uploaded file
                    const file = await this.ctx.getFile();
                    return await file.getUrl();
                }
        
                this.path = this.editPath(this.path);
                if(!fs.existsSync(`${__dirname}${this.path}`)){
                    fs.mkdirSync(`${__dirname}${this.path}`, {recursive: true})
                }
                const file = await this.ctx.getFile();
                const fileRegex = /.*(\..*)/;
                let ctxFilePath = file?.file_path;
                let extension = ctxFilePath.match(fileRegex)[1];
                const downloadPath = await file.download(`${__dirname}${this.path}\\${this.ctx?.from?.id}${extension}`);
                return downloadPath;
            }catch(e){
                throw new Error(e.message);
            }
        }
        
        public editPath(path:string):string{// Removes ./ and / and replaces with \ and returns path
            if(path.includes("./")||path.includes("/")){
                return path.replace(/\.\/|\//g, '\\');
            }
            return path;
        }
    }
}

export default FileHandling;