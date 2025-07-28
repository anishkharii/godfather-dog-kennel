

export async function uploadImage(file){
    const formData = new FormData();
    formData.append('upload_preset',"GodFather-Kennel");
    formData.append('file',file);

    try{
        const res = await fetch("https://api.cloudinary.com/v1_1/dv06id9q6/image/upload",{
            method:"POST",
            body:formData
        });
        const data = await res.json();
        console.log(data);
        return data.secure_url;
    }catch(err){
        console.error("Error uploading image:", err);
        return null;
    }

}