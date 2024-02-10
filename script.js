const res = function (s, t) {
  if (s.length < t.length) return "";
  let count = {};

  for (let i = 0; i < t.length; i++) {
    let curr = t.charCodeAt(i);
    if (count[curr]) {
      count[curr]++;
    } else {
      count[curr] = 1;
    }
  }
  let left = 0,
    right = 0,
    minStart = 0,
    min = s.length + 1,
    remaining = t.length;

  while (right < s.length) {
    if (--count[s.charCodeAt(right++)] >= 0) remaining--;
    while (remaining == 0) {
      if (right - left < min) {
        min = right - left;
        minStart = left;
      }
      if (++count[s.charCodeAt(left++)] > 0) remaining++;
    }
  }
  return min < s.length + 1 ? s.substring(minStart, minStart + min) : "";
};

console.log(res("ADOBECODE", "ABC"));
