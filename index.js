import express from "express";
import bodyParser from "body-parser";
import pg from"pg";



const app = express();
const port = 8000;


const db =new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"world",
  password:"K@rmvir20",
  port:5432,
});
db.connect();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisisted(){

  const result=await db.query("SELECT country_code FROM visited_countries");
  let countries=[];
  result.rows.forEach((country)=>{
    countries.push(country.country_code);
  });
  return countries;
}





app.get("/", async (req, res) => {
   const countries= await checkVisisted();
  res.render("index.ejs",{countries: countries,total:countries.length});

});

app.post("/add", async (req,res)=>{
  let input = req.body["country"];
  if (typeof input !== 'string' || input.length === 0) {
    input =input;
  }
else{
   input =input.charAt(0).toUpperCase() + input.slice(1,input.length()).toLowerCase();
}
 


  const result = await db.query(
    "SELECT country_code FROM countries WHERE country_name = $1",
    [input]
  );


  if(result.rows.length!==0)
  {
    const data=result.rows[0];
    const countryCode=data.country_code;


    await db.query('INSERT INTO visited_countries(country_code) VALUES ($1)',[countryCode],
    );
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
