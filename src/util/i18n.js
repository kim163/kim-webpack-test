// translate title
export function generateTitle(title) {
  const hasKey = this.$te(title)
  const translatedTitle = this.$t(title) // $t :this method from vue-i18n, inject in @/lang/index.js

  if (hasKey) {
    return translatedTitle
  }
  return title
}
