function relativize(url){
    const img = document.createElement('img');
    img.src = 'a.png'; //  5 characters long
    const prefix = img.src.substring(0, img.src.length - 5);
    if(url && url.startsWith(prefix)){
        return url.substring(prefix.length);
    } else {
        return url;
    }
}

export {relativize};