
- Developed on Apache2, mysql, php5
- SQL file needs to be imported
- Mysql username and password needs to be changed in save.php
- If mysql is not on localhost change hostname in Database.class.php

Standard Libraries Used
- Jquery
- Booststrap
- JqueryUI

handlebars.js is used for template compilation purpose.

Usage 
- Drag Drop elements to create custom form
- Elements can be modified after adding to form
- Submitting the form will insert data into database and will be added
  under Inserted Data section. Reloading the page, however, will clean the data from section

Limitation
- Form is not preserverd therefore refresh of page will make it reset
- Data is not fetched on refresh to display
- List elements does not have option to set default values
- May not work properly with IE.

Data is stored in json format like { fiel_name{ field_label, field_data } }. As postgress is better
in handling json data it would be good idea to use postgress database.

PHP does not have much work to do as it is used only to store and retrive data only insert is implemented
for demostration purpose.

As I already made something like this for one of my project using
"https://github.com/anupshinde/demos/tree/gh-pages/form-builder-part2" I modified my older code to match current
requirement