---
heading: Create pages
caption: Build a basic prototype
---

You can create pages by using the templates that come with the Prototype Kit.

In your browser go to the **Manage you prototype** page: http://localhost/manage-prototype. There is also a link to this page in the footer of your prototype.

In the navigation menu, go to the **Templates** section.

### Create a start page

In the list of templates, find the Start page, then select **Create**.

The next page is titled **Create new Start page**.

In **Path for the new page** enter `/start`.

Select **Create page**.

The kit creates a page from the template, in the `app/views` folder in your code editor.

#### Change the service name

You change the service name in the config file. This will change it on every page in your prototype.

1. In your code editor, go to the `app` folder and open the `config.js` file.

2. Change `serviceName` from **Service name goes here** to **Apply for a juggling licence**.

3. Press Cmd+S on Mac or Ctrl+S on Windows to save your change.

4. Refresh the page in your browser.

You’ll need to save every time you make a change to a file.

Usually your changes will automatically show in the browser without refreshing. However, for this config change, you need to refresh the page. You should see your service name change on the Start page.

### Question pages

In your browser, go to the **Templates** section of **Manage your prototype**.

Create a page from the **Question page** template.

Enter the path `/juggling-balls`.

Create another page from the Question page template.

Enter the path `/juggling-trick`.

Go to the following URLs to check your pages:

- http://localhost:3000/juggling-balls
- http://localhost:3000/juggling-trick

Go to your code editor.

In the `juggling-balls.html` file, change the text inside the `h1` tag from `Heading or question goes here` to `How many balls can you juggle?`.

In the `juggling-trick.html` file, change the text inside the `h1` tag to `What is your most impressive juggling trick?`.

### 'Check answers' page

In your browser, create a page from the **Check answers** template.

Enter the path `/check-answers`.

### Confirmation page

Create a page from the **Confirmation** template.

Enter the path `/confirmation`.

[Next (link your pages together)](link-pages-together)