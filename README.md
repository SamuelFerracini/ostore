<p align="center">
  <a href="https://commerce.nuxt.dev">
    <img alt="NuxtCommerce - Headless storefront for Woocommerce" src="https://github.com/user-attachments/assets/1c6720b7-5aea-4f6b-be55-8944fb81799a">
  </a>

  <h1 align="center">NuxtCommerce</h2>

  <p align="center">
    An open-source, dynamic e-commerce solution powered by Nuxt 3 and GraphQL, headless storefront replacement for Woocommerce. Featuring a user interface in the style of Pinterest and fully customizable (Vue, Nuxt3).
    <br />
    <br />
    <a href="https://commerce.nuxt.dev"><strong>🚀 Live Demo</strong></a>
  </p>
</p>

## Introduction

NuxtCommerce is a dynamic and lively e-commerce platform developed with Nuxt 3. Developed for WooCommerce, NuxtCommerce optimizes data flow with [WPGraphQL](https://github.com/wp-graphql/wp-graphql), offering an efficient shopping experience. It stands out with its Pinterest-style user-friendly interface and fashion-oriented structure. With its dark mode feature and open-source nature, it offers flexibility and continuous development opportunities.

If your product stocks and prices are not changeable, and you are not continuously uploading new products, it could be beneficial for you to opt for [Woonuxt](https://github.com/scottyzen/woonuxt#readme). This project, developed by [scottyzen](https://github.com/scottyzen), is static, thus providing a faster solution.

## Stack

- Nuxt3 / Vue
- Headless Storefront
- GraphQL with Apollo Client
- NUXT UI / Tailwind CSS
- Pinterest Interface
- Developed for WooCommerce
- Dynamic
- Open Source
- Suitable for Fashion Category
- Dark Mode
- UI Lab

## Contributing

Contributions of any kind are welcome! You can open an issue for requests, bug reports, or general feedback, or you can directly create a pull request(PR).

## Contact

Don't hesitate to get in touch if you have any questions or suggestions:

Email: zckhtln@icloud.com</br>
Twitter: [@ZHatlen](https://twitter.com/ZHatlen)

## Admin mode

Admin mode turns on only with a password, at `/admin`. The repo stores just a salted SHA-256 hash of it, never the password.

Set or rotate the password:

1. Run `npm run admin:hash`. Type the password at the hidden prompt (or pipe it on stdin). It prints a hash.
2. Paste the hash into `adminPasswordHash` in `storefront.config.js`, then deploy.

While `adminPasswordHash` is empty, admin mode cannot be turned on. Rotating the password logs out every old admin cookie. `?admin=0` or the admin bar exit button turns admin mode off.
