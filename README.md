# Demo link external account by node.js

This application help you, link your application's ID to external ID of google and amazon.

You already have identify mechanisum on Android application or iOS application.

But your application recover user's ID is hard work, this application is useful.


## Summary of application

## modules

`express`

`passport`

these strategy use for passport module

* `passport-google-openidconnect` module for Google OpenID Connect
* `passport-amazon` module for Amazon

Application's session save to mongodb by `connect-mongo`.

`mongoose` module for model.


### mode

Application have two mode

* link to external account
* recovery from external account


## Requirements

* [NodeJs](http://nodejs.org)
* [mongodb](http://mongodb.org)

## Pre setting

**NOTE:** Setting files are `config/` directory.

Please refer to [config module](https://www.npmjs.com/package/config)

### external account setting

Do not forget to set the google and amazon `client_id`s, `client_secret`s and `redirect`s.

### mongodb setting

Do not forget to set the mongodb `url`, optional `collection_sessions`.

## Install

```sh
$ git clone https://github.com/kkkon/demo-link-ext-account-by-node.git
$ npm install
```

and then

```sh
$ npm start
```

Finally, access to [http://localhost:3000/](http://localhost:3000).

## kick this application from your application

**NOTE:** You must encrypt or encode, againt attack.

Or change to token for these parameters, `mode` and `appuid`.

### link mode

    http://localhost:3000/?mode=link&appuid=XXXX


### recover mode

    http://localhost:3000/?mode=recovery

## regist User at development env

    http://localhost:3000/dev/regist?appuid=XXXX


## Credits

  - [Kiyofumi Kondoh](http://github.com/kkkon)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Kiyofumi Kondoh
