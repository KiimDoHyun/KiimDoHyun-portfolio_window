module.exports = {
  css: () => "",
  cva: () => () => "",
  cx: (...args) => args.filter(Boolean).join(" "),
  sva: () => () => ({}),
};
