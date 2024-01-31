const fs = require('fs')
const list = require('./tools.json')

const tools = {}
for (const tool of list) {
  delete tool._id
  tool.content = ''
  tools[tool.id] = tool
}

fs.writeFileSync('./tools.json', JSON.stringify(tools, null, 2))
