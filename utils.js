module.exports.slugify = function slugify(string) {
  return string
    .trim()
    .toLowerCase()
    .replace(/\ /g, "-")
    .replace(/[^a-z0-9\-]/g, "");
};

module.exports.formatDate = function formatDate(datetime) {
  return datetime.toISOString().split("T")[0];
};

module.exports.formatTime = function formatTime(datetime) {
  return datetime
    .toISOString()
    .split("T")[1]
    .split(".")[0];
};
