var Review = function(datetime, rating, content) {
    this.datetime = datetime;
    this.rating = rating;
    this.content = content;
}

Review.prototype.constructor = Review;

module.exports = Review