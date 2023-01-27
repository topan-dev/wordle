$(document).ready(()=>{
    $("#password-confirm").click(()=>{
        $.post("/i/changepassword",{
            old: $('#password-old').val(),
            new: $('#password-new').val(),
            repeat: $('#password-repeat').val()
        },(data,status)=>{
            if(data.error!=undefined)
                $('#changepassword-error').text(data.error),
                $('#changepassword-message').text("");
            else $('#changepassword-error').text(""),
                $('#changepassword-message').text(data.message);
        });
    });
    $("#headimage-input").change(()=>{
        var uploadfile=$("#headimage-input")[0].files[0];
        let reader=new FileReader();
        reader.readAsDataURL(uploadfile);
        reader.onload=(temp)=>{
            let data=temp.target.result;
            $("#headimage-preview")[0].src=data;
        }
    });
    $("#headimage-confirm").click(()=>{
        if(!$("#headimage-input").val()){
            alert("Please upload pictures first.");
            return;
        }
        var uploadfile=$("#headimage-input")[0].files[0];
        if(uploadfile.size>=5*1024*1024){
            alert("Picture size must be less than 5 MiB.");
            return;
        }
        var formdata=new FormData();
        formdata.append("headimage_upload",uploadfile);
        $.ajax({
            url: "/i/changeheadimage",
            type: 'POST',
            data: formdata,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                alert(data.message);
            }
        });
    });
});