


// Some JavaScript to load the image and show the form. There is no actual backend functionality. This is just the UI
const filename=document.querySelector('#filename')
const form = document.querySelector('#img-form');
const img=document.querySelector('#img');
const outputPath=document.querySelector('#output-path');
const heightInput=document.querySelector('#height');
const widthInput=document.querySelector('#width');



function loadImage(e) {
   const file=e.target.files[0];
  if(!isFileImage(file)){
    alertError('Đấy có phải ảnh đâu')
    return;
  }
  // Get original dimensions
  const image=new Image();
  image.src=URL.createObjectURL(file);
  image.onload=function() {
    widthInput.value=this.width;
    heightInput.value=this.height;
  }
  form.style.display='block';
  filename.innerText = file.name;
  outputPath.innerText=path.join(os.homedir(),'imageresizer');
}
function sendImage(e) {
e.preventDefault();
const width=widthInput.value
const height=heightInput.value
const imgPath=img.files[0].path
if(!img.files[0]){
  alertError('có phải ảnh đâu ')
  return;
}
if(width===''||height===''){
  alertError('bạn quên chưa nhập chiều cao với độ lớn kìa')
}
ipcRenderer.send('image:resize',{
  imgPath,
  width,
  height
})
}
//Catch the image :done event
ipcRenderer.on('image:done',()=>{
  alertSuccess(`Image resize successful to ${widthInput.value} x ${heightInput.value}`)
})
// Check file is image 
function isFileImage(file){
  const acceptedImageTypes=['image/gif', 'image/jpeg', 'image/png']
  return file&&acceptedImageTypes.includes(file['type'])
}
function alertError(message){
  Toastify.toast({
    text:message,
    duration:5000,
    close:false,
    style:{
      background:'red',
      color:'white',
      textAlign:'center'
    }
  })
}
function alertSuccess(message){
  Toastify.toast({
    text:message,
    duration:5000,
    close:false,
    style:{
      background:'green',
      color:'white',
      textAlign:'center'
    }
  })
}
document.querySelector('#img').addEventListener('change', loadImage);


img.addEventListener('change', loadImage);
form.addEventListener('submit',sendImage)
