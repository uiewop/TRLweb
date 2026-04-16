/** @jsx jsx */
import { jsx } from "theme-ui"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
  <footer
    className="site-footer"
    sx={{
      bg: "siteColor",
    }}
  >
    <div className="container">
      <p>© Translearn {currentYear}</p>
    </div>
  </footer>
  )
}

export default Footer
