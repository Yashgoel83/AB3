export interface Mediainfo {
Name:string,
Label:string[],
Dimension:string,
size:string,
DetectedText:string[],
Image:Boolean,
Video:Boolean,
VideoMediaInfo : {},
VideoCueDetection:{},
VideoContentModeration :{},
Codec:string,
Format:string,
Colorrange:string,
Duration:string
}

export interface addetails{
    url:string
    product:string
    price:string
}

export interface adddetails_temp{
    url:string
    product:string
    price:string
        
    }
export interface mediaobject{
    key:string
    type:string
    assetid:string
}
