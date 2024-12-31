function xorString(str: string, key: string): string {
  let result = "";
  // Rather than getting creative when the key is too short,
  // I've opted to do most expected thing possible instead.
  // Totally secure! (not really)
  if (key.length < str.length)
    key = key.repeat(Math.ceil(str.length / key.length));

  for (let i = 0; i < str.length; i++)
    result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));

  return result;
}
