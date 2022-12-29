---
heading: Branching journeys using checkboxes
---

You can create branching journeys using any form fields. In this example we will use checkboxes.

## The page

You'll need a page, in this example we'll create one called `app/views/exports.html`, from the Question page template.

In the `content` block add a form with radio buttons:

```
<form class="form" action="/exports-answer" method="post">

{{ govukCheckboxes({
  name: "exports",
  values: data["exports"],
  fieldset: {
    legend: {
      text: "What do you export?",
      isPageHeading: true,
      classes: "govuk-fieldset__legend--l"
    }
  },
  hint: {
    text: "Select all that apply."
  },
  items: [
    {
      value: "Fruit",
      text: "Fruit"
    },
    {
      value: "Vegetables",
      text: "Vegetables"
    },
    {
      value: "Meat",
      text: "Meat"
    }
  ]
}) }}

{{ govukButton({
  text: "Continue"
}) }}

</form>
```

Some things to note:

The form `action` is "/exports-answer", and the `method` is "post", so this will make a 'post' request to the path "/exports-answer" - we will need a route to respond to that request.

In the checkboxes component, the `name` is "exports". The name is important - it is where the kit stores the answer to the question. Names can't have spaces so use hyphens instead, and use lowercase for simplicity.

Do not add an `href` to the button - this will turn it into a link and means it no longer submits the form.

## A route to check if an answer is selected

In `app/routes.js` we need to add a route to process the answer from the form.

```
router.post('/exports-answer', function(request, response) {

	var exports = request.session.data['exports']
	if (exports.includes("Fruit")){
		response.redirect("/fruit")
	} else {
		response.redirect("/next-question")
	}
})
```

`router.post`

This route is for a post request - the `method` we set on the form.

`'/exports-answer'`

This route is for a request to '/exports-answer' - the 'action' we set on the form.

`var exports = request.session.data['exports']`

The kit stores all the data from forms in `request.session.data`, using the 'name' we used in the component, in this case `exports`. We copy it to a shorter variable (country) so it's easier to type later on.

`if (exports.includes("Fruit")){`

Checkboxes are always stored as 'arrays' in the Prototype Kit. This code checks whether the array stored for exports includes "Fruit" - the 'value' on one of our checkboxes. Note that this will also be true if any of the other checkboxes were ticked. We'll see how to check for only specific answers in a later example.

`response.redirect("/fruit")`

Send a redirect as a response to the browser - sending it to the path "/fruit" - a page with specific questions about fruit.

`} else {`

If 'exports' does not include 'Fruit', run the code after:

`response.redirect("/next-question")`

Send a redirect as a response to the browser - sending it to the path "/next-question" (or whatever path your next question is).

## A route to check if only a specific answer is selected

Add this line at the top of `routes.js`:

```
const util = require('util')
```

Then add this route:

```
router.post('/exports-answer', function(request, response) {

	var exports = request.session.data['exports']
	if (util.deepStrictEqual(exports, ['Fruit'])){
		response.redirect("/fruit")
	} else {
		response.redirect("/next-question")
	}
})
```

This is all the same as our first example, but instead of `includes` we have

```
util.deepStrictEqual(exports, ['Fruit'])
```

This checks if the `exports` array is the same as an array that only contains 'Fruit' and nothing else. We could also check for 2 specific values:

```
util.deepStrictEqual(exports, ['Fruit', 'Vegetables'])
```

Note the order is the same as the checkboxes, that's important - checking another order won't work.
