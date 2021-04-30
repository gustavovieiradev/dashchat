
import cookie from "cookie"

export function parseCookies(req = null) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie)
}