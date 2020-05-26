const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [
  {
    id: '123123',
    title: 'Project title',
    url: 'Project description',
    techs: ["React", "Node.js"],
    amountLikes: 0
  }
];

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    amountLikes: 0,
  }

  repositories.push(newRepository)

  response.status(200).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const oldRepository = repositories[repositoryIndex];
  const newRepository = { ...oldRepository, title, url, techs };

  repositories[repositoryIndex] = newRepository;

  return response.status(200).json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(200).json({ message: "Repository successfully deleted" });
});

app.put("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const oldRepository = repositories[repositoryIndex];
  const newRepository = { ...oldRepository, amountLikes: oldRepository.amountLikes + 1 };
 
  repositories[repositoryIndex] = newRepository;

  return response.status(200).json(newRepository);
});

module.exports = app;
