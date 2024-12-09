import multer  from "multer"
import path from "path"


const storage = multer.diskStorage({
   destination:'images/',
   filename:(req,file,cb)=>{
        console.log(file)
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
   }
        
})

const upload = multer({
    storage:storage,
    limits:{
        fileSize : 1024*1024*3
    }
})
export default upload