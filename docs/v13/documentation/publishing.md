---
heading: Publish your prototype online
title: Publish your prototype online
---

Publishing your prototype online means you can:
 - share it with colleagues for collaboration
 - test it with users on their own devices

You'll need a hosting service to publish prototypes online.

## Hosting services

The GOV.UK Prototype Kit runs on any hosting service that supports Node.js.

Your organisation may already use a hosting service for the Prototype Kit. Check with your IT or digital team about which platform to use.

Some hosting services automatically publish every time you [push to GitHub](./github-desktop). For example:

 - [Railway](https://railway.app/new/github)
 - [Render](https://render.com/docs/github)
 - [Heroku](https://devcenter.heroku.com/articles/github-integration) (requires payment)

## Setting a password

When running the Prototype Kit online, you need to set a password. This is to stop anyone finding your prototype accidentally and mistaking it for a real service.

Check your hosting services documentation on how to set 'environment variables' (it may have a slightly different name like 'config vars' or 'variables').

Add an environment variable where the 'name' is NODE_ENV, and the 'value' is 'production'.

Add another environment variable where the 'name' is PASSWORD, and the 'value' is whatever password you would like to use.

### If you get an error about username

Older versions of the Prototype Kit require a username - you can [migrate your prototype to version 13](./migrate-an-existing-prototype) or set a username:

Add another environment variable where the 'name' is USERNAME, and the 'value' is whatever username you would like to use.
