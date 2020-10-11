export default class Post {
    constructor(title, img){
        this.title = title;
        this.date = new Date();
        this.img = img;

        console.log( typeof( this.img) );
    }

    toString() {
        return JSON.stringify( {
            title: this.title,
            date: this.date.toJSON(),
            img: this.img
        }, null, 2 );
    }
}