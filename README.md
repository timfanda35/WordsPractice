# WordPractice

This is a practice project with react-native for flash card.

# Setup

Clone this project

```shell
git clone git@github.com:timfanda35/WordsPractice.git
```

Install dependency

```shell
npm install
```

Login [Parse.com](https://parse.com)

- Create a Project
- In Data section of Core page,  create a Class name `Word`
- Add Col to `Word`, Table schema:

| type         | name
| ------------ | ----
| String       | objectId
| Date         | createdAt
| Date         | updatedAt
| String       | word
| String       | explain

- In Keys page of Settings section, get api keys:
  - Application ID
  - JavaScript Key

Copy `environment.js,sample` to `environment.js`

Fill variables in `environment.js`

```javascript
var Environment = {
    PARSE_APPLICATION_ID: 'your_parse_application_id',
    PARSE_JAVASCRIPT_KEY: 'your_parse_javascript_key',
};

module.exports = Environment

```
