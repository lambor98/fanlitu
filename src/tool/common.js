import {Toast} from "vant";
export function judge(res){
    if(res.data.status=="1000"){
        Toast("修改成功");
    }else{
        Toast(res.data.msg)
    }
}