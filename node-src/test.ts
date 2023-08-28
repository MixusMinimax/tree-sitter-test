import Parser = require('web-tree-sitter')


const examples: Record<string, (parser: Parser) => void> = {
    example1(parser: Parser) {
        const code = 'module core::event;'
        const tree = parser.parse(code)

        console.log('Tree:')
        console.log(tree.rootNode.toString())
        console.log()

        const query = parser.getLanguage().query(`
            (source_file
              (module
                path: (path
                  [
                    (identifier) @namespace
                    _
                  ]*)))`)
        const captures = query.captures(tree.rootNode)

        console.log('Captures:')
        captures.forEach((capture, i) => {
            console.log({
                index: i,
                name: capture.name,
                nodeId: capture.node.id,
                text: capture.node.text,
            })
        })
        console.log()

        const matches = query.matches(tree.rootNode)
        console.log('Matches:')
        matches.forEach((match, i) => {
            console.log({
                index: i,
                pattern: match.pattern,
                captures: match.captures.map((capture, i) => ({index: i,
                    name: capture.name,
                    nodeId: capture.node.id,
                    text: capture.node.text,})
                )
            })
        })
    }
}

async function main() {
    await Parser.init()
    const language = await Parser.Language.load('./tree-sitter-test.wasm')
    const parser = new Parser()
    parser.setLanguage(language)

    for (const name in examples) {
        console.log(`Running example ${name}`)
        examples[name](parser)
    }
}

main().then()
