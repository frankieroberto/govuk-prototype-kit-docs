---
heading: Branching journeys using radios
---

You can create branching journeys using any form fields. In this example we will use radios.

## The page

You'll need a page, in this example we'll create one called `app/views/country.html`, from the Question page template.

In the `content` block add a form with radio buttons:

```
<form class="form" action="/country-answer" method="post">

{{ govukRadios({
  name: "country",
  value: data['country'],
  fieldset: {
    legend: {
      text: "Where do you live?",
      isPageHeading: true,
      classes: "govuk-fieldset__legend--l"
    }
  },
  items: [
    {
      value: "England",
      text: "England"
    },
    {
      value: "Scotland",
      text: "Scotland"
    },
    {
      value: "Wales",
      text: "Wales"
    },
    {
      value: "Northern Ireland",
      text: "Northern Ireland"
    }
  ]
}) }}

{{ govukButton({
  text: "Continue"
}) }}

</form>
```

Some things to note:

The form `action` is "/country-answer", and the `method` is "post", so this will make a 'post' request to the path "/country-answer" - we will need a route to respond to that request.

In the radios component, the `name` is "country". The name is important - it is where the kit stores the answer to the question. Names can't have spaces so use hyphens instead, and use lowercase for simplicity.

Do not add an `href` to the button - this will turn it into a link and means it no longer submits the form.

## The route

In `app/routes.js` we need to add a route to process the answer from the form.

```
router.post('/country-answer', function(request, response) {

	var country = request.session.data['country']
	if (country == "England"){
		response.redirect("/age")
	} else {
		response.redirect("/ineligible-country")
	}
})
```

`router.post`

This route is for a post request - the `method` we set on the form.

`'/country-answer'`

This route is for a request to '/country-answer' - the 'action' we set on the form.

`var country = request.session.data['country']`

The kit stores all the data from forms in `request.session.data`, using the 'name' we used in the component, in this case `country`. We copy it to a shorter variable (country) so it's easier to type later on.

`if (country == "England"){`

This checks whether the data stored for country is "England" - the 'value' on one of our radio buttons. Note the double = symbol for checking equality. A single = makes a copy as we did above.

`response.redirect("/age")`

Send a redirect as a response to the browser - sending it to the path "/age" - the next page in the service.

`} else {`

If 'country' is not 'England', run the code after:

`response.redirect("/ineligible-country")`

Send a redirect as a response to the browser - sending it to the path "/ineligible-country". A page where we can tell the user they can't use this service in their country, and what to do instead.
