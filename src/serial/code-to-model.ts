import Ts from 'typescript';

export default function parseJsonFromTs(data: string) {
    const sourceFile = Ts.createSourceFile('view', data, Ts.ScriptTarget.Latest)

    const imports = {};
    const variables = {};
    const parents = {};
    const bodies = {};
    let classes = 0;
    let constructors = 0;

    function visitNode(node: Ts.Node) {
        if (Ts.isImportDeclaration(node)) {
            const importDeclaration = node as Ts.ImportDeclaration;
            const typeId = importDeclaration.importClause?.name;
            if (!!typeId?.text && Ts.isStringLiteral(importDeclaration.moduleSpecifier)) {
                const tName = typeId?.text;
                imports[tName] = (importDeclaration.moduleSpecifier as Ts.StringLiteral).text;
            }
        }
        if (Ts.isClassDeclaration(node)) {
            classes++;
            const classDeclaration = node as Ts.ClassDeclaration;
            classDeclaration.members.forEach((member: Ts.ClassElement) => {
                if (Ts.isConstructorDeclaration(member)) {
                    constructors++;
                    const constructorDeclaration = member as Ts.ConstructorDeclaration;
                    constructorDeclaration.body
                        ?.statements
                        ?.filter((statement: Ts.Statement) => Ts.isVariableStatement(statement))
                        ?.forEach((statement: Ts.VariableStatement) => {
                            statement.declarationList.declarations
                                .filter(declaration => Ts.isVariableDeclaration(declaration))
                                .filter(declaration => declaration.initializer != null && Ts.isNewExpression(declaration.initializer))
                                .forEach((declaration: Ts.VariableDeclaration) => {
                                    if (Ts.isIdentifier(declaration.name)) {
                                        const varNameId = declaration.name as Ts.Identifier
                                        const varName = varNameId.text
                                        const newExpression = declaration.initializer as Ts.NewExpression
                                        if (Ts.isIdentifier(newExpression.expression)) {
                                            const newExpressionId = newExpression.expression as Ts.Identifier
                                            variables[varName] = newExpressionId.text
                                        }
                                    }
                                })
                        });
                    constructorDeclaration.body
                        ?.statements
                        ?.filter((statement: Ts.Statement) => Ts.isExpressionStatement(statement))
                        ?.forEach((statement: Ts.ExpressionStatement) => {
                            if (Ts.isCallExpression(statement.expression)) {
                                const callExpression = statement.expression as Ts.CallExpression
                                if (callExpression.arguments.length == 1 && Ts.isIdentifier(callExpression.arguments[0])) {
                                    const arg0Id = callExpression.arguments[0] as Ts.Identifier
                                    const widget = arg0Id.text
                                    if (Ts.isPropertyAccessExpression(callExpression.expression)) {
                                        const propertyAccessExpression = callExpression.expression as Ts.PropertyAccessExpression
                                        if (propertyAccessExpression.name.text == 'add' && Ts.isIdentifier(propertyAccessExpression.expression)) {
                                            const varNameId = propertyAccessExpression.expression as Ts.Identifier
                                            const container = varNameId.text
                                            parents[widget] = container;
                                        }
                                    }
                                }
                            }
                        })
                    constructorDeclaration.body
                        ?.statements
                        ?.filter((statement: Ts.Statement) => Ts.isBlock(statement))
                        ?.forEach((block: Ts.Block) => {
                            block.statements
                                .filter(statement => Ts.isExpressionStatement(statement))
                                .filter((statement: Ts.ExpressionStatement) => Ts.isBinaryExpression(statement.expression))
                                .forEach((statement: Ts.ExpressionStatement) => {
                                    const binaryExpression = statement.expression as Ts.BinaryExpression
                                    if (binaryExpression.operatorToken.kind == Ts.SyntaxKind.EqualsToken) {
                                        if (Ts.isPropertyAccessExpression(binaryExpression.left)) {
                                            let left: Ts.Expression = binaryExpression.left
                                            const chain = []
                                            while (left != null && Ts.isPropertyAccessExpression(left)) {
                                                const propertyAccessExpression = left as Ts.PropertyAccessExpression
                                                chain.unshift(propertyAccessExpression.name.text)
                                                left = propertyAccessExpression.expression
                                            }
                                            if (left != null && Ts.isIdentifier(left)) {
                                                const varName = left.text // variable
                                                const memberPath = chain.join('.') // property path
                                                if (!bodies[varName]) {
                                                    bodies[varName] = {};
                                                }
                                                const body = bodies[varName];
                                                if (binaryExpression.right.kind == Ts.SyntaxKind.StringLiteral) {
                                                    const stringLiteral = binaryExpression.right as Ts.StringLiteral
                                                    body[memberPath] = stringLiteral.text
                                                } else if (binaryExpression.right.kind == Ts.SyntaxKind.NumericLiteral) {
                                                    const numericLiteral = binaryExpression.right as Ts.NumericLiteral
                                                    body[memberPath] = Number(numericLiteral.text)
                                                } else if (binaryExpression.right.kind == Ts.SyntaxKind.NullKeyword) {
                                                    body[memberPath] = null
                                                } else if (binaryExpression.right.kind == Ts.SyntaxKind.TrueKeyword) {
                                                    body[memberPath] = true
                                                } else if (binaryExpression.right.kind == Ts.SyntaxKind.FalseKeyword) {
                                                    body[memberPath] = false
                                                }
                                            }
                                        }
                                    }
                                })
                        })
                }
            })
        }
    }
    Ts.forEachChild(sourceFile, visitNode)

    /*
        const ast = parser.parse(data, {
            sourceType: "module"
        });
        traverse(ast, {
            enter(path) {
                if (
                    t.isImportDeclaration(path.node) &&
                    t.isStringLiteral(path.node.source) &&
                    Array.isArray(path.node.specifiers) &&
                    path.node.specifiers.length === 1 &&
                    t.isImportDefaultSpecifier(path.node.specifiers[0]) &&
                    t.isIdentifier(path.node.specifiers[0].local)
                ) {
                    imports[path.node.specifiers[0].local.name] = path.node.source.value;
                }
                if (t.isClassDeclaration(path.node)) {
                    classes++;
                }
                if (t.isClassMethod(path.node) && path.node.kind === 'constructor') {
                    constructors++;
                    path.node.body.body.forEach((constructorItem, i) => {
                        if (t.isVariableDeclaration(constructorItem)) {
                            constructorItem.declarations.forEach((item, i) => {
                                if (t.isVariableDeclarator(item) && t.isIdentifier(item.id) && t.isNewExpression(item.init) && t.isIdentifier(item.init.callee)) {
                                    variables[item.id.name] = item.init.callee.name;
                                }
                            });
                        }
                    });
                }
                if (classes === 1 &&
                    t.isAssignmentExpression(path.node) &&
                    t.isMemberExpression(path.node.left)
                ) {
                    const memberPath = [path.node.left.property.name];
                    let objectNode = path.node.left.object;
                    while (t.isMemberExpression(objectNode)) {
                        memberPath.unshift(objectNode.property.name);
                        objectNode = objectNode.object;
                    }
                    if (t.isIdentifier(objectNode)) {
                        if (!bodies[objectNode.name]) {
                            bodies[objectNode.name] = {};
                        }
                        const body = bodies[objectNode.name];
                        const property = memberPath.join('.');
                        if (t.isStringLiteral(path.node.right)) {
                            body[property] = path.node.right.value;
                        } else if (t.isNumericLiteral(path.node.right)) {
                            body[property] = path.node.right.value;
                        } else if (t.isBooleanLiteral(path.node.right)) {
                            body[property] = path.node.right.value;
                        } else if (t.isNullLiteral(path.node.right)) {
                            body[property] = null;
                        }
                    }
                }
                if (t.isCallExpression(path.node) &&
                    t.isMemberExpression(path.node.callee) &&
                    t.isIdentifier(path.node.callee.object) && t.isIdentifier(path.node.callee.property) &&
                    path.node.arguments.length === 1 && t.isIdentifier(path.node.arguments[0]) &&
                    (path.node.callee.property.name === 'add' || path.node.callee.property.name === 'addColumnNode') &&
                    variables[path.node.callee.object.name] && variables[path.node.arguments[0].name]) {
                    const container = path.node.callee.object.name;
                    const widget = path.node.arguments[0].name;
                    parents[widget] = container;
                }
            }
        })
        */
    if (classes > 1) {
        throw Error(`${classes} classes found. One and only one class is expected to be a Kenga view`);
    }
    if (constructors > 1) {
        throw Error(`${constructors} constructors found. One and only one constructor of Kenga view class is expected`);
    }
    const widgets = {};
    for (const name in variables) {
        const type = variables[name];
        if (type && imports[type]) {
            widgets[name] = {
                from: imports[type],
                body: (bodies[name] || {}),
                children: {}
            };
        }
    }
    const view = {};
    for (const widgetName in parents) {
        const parentName = parents[widgetName];
        if (parentName && widgets[parentName]) {
            const parent = widgets[parentName];
            parent.children[widgetName] = widgets[widgetName];
        }
    }
    for (const name in widgets) {
        if (!parents.hasOwnProperty(name)) {
            view[name] = widgets[name];
        }
    }
    return view;
}
