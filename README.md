<h1>Phantom Power Tracker</h1>
<p>The PhantomPower Tracker is a web application that helps families track their electricity usage by visualising appliances on this webapp. Appliances switched on for longer than 3 hours will be notified via email to turn it off. </p>

<h2>Goal</h2>
<p>The goal of this web application is to inculcate the habit of reducing carbon footprint through efficient use of electricity at home<p/>

<h1>Setup</h1>
<p>1. Create a MongoDB account and project</p> 
<p> [OPTIONAL] You may upload dummy data into the database using the importFile.json. If you want to create your own, ensure the fields are the same and run the following command on cmd: </p>
<p>mongoimport --uri "mongodb+srv://<username>:<password>@<cluster_name>.cr8ip.mongodb.net/<project_name>" --collection <collection_name> --file "<path_to_json_file>" --jsonArray</p>
  <br>
<p> 2.npm install the following libraries: mongoose, nodemailer, npm-fetch </p>
<p>P.S. If there are any other dependencies that are missing, please install them as well</p> 
  <br>
<p>3. Duplicate sample.env and rename to .env.local. Fill in the fields with your own credentials </p>
<p>When filling in the EMAIL_PASS, please ensure it is a gmail account with 2FA turned on. Create an app password within the google setting</p>


<h1>Running the Application</h1>
<p>npm run dev</p>
