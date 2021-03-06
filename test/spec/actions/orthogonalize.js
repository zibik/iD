describe("iD.actions.Orthogonalize", function () {
    var projection = d3.geo.mercator();

    it("orthogonalizes a perfect quad", function () {
        var graph = iD.Graph({
                'a': iD.Node({id: 'a', loc: [0, 0]}),
                'b': iD.Node({id: 'b', loc: [2, 0]}),
                'c': iD.Node({id: 'c', loc: [2, 2]}),
                'd': iD.Node({id: 'd', loc: [0, 2]}),
                '-': iD.Way({id: '-', nodes: ['a', 'b', 'c', 'd', 'a']})
            });

        graph = iD.actions.Orthogonalize('-', projection)(graph);

        expect(graph.entity('-').nodes).to.have.length(5);
    });

    it("orthogonalizes a quad", function () {
        var graph = iD.Graph({
                'a': iD.Node({id: 'a', loc: [0, 0]}),
                'b': iD.Node({id: 'b', loc: [4, 0]}),
                'c': iD.Node({id: 'c', loc: [3, 2]}),
                'd': iD.Node({id: 'd', loc: [0, 2]}),
                '-': iD.Way({id: '-', nodes: ['a', 'b', 'c', 'd', 'a']})
            });

        graph = iD.actions.Orthogonalize('-', projection)(graph);

        expect(graph.entity('-').nodes).to.have.length(5);
    });

    it("orthogonalizes a triangle", function () {
        var graph = iD.Graph({
                'a': iD.Node({id: 'a', loc: [0, 0]}),
                'b': iD.Node({id: 'b', loc: [3, 0]}),
                'c': iD.Node({id: 'c', loc: [2, 2]}),
                '-': iD.Way({id: '-', nodes: ['a', 'b', 'c', 'a']})
            });

        graph = iD.actions.Orthogonalize('-', projection)(graph);

        expect(graph.entity('-').nodes).to.have.length(4);
    });

    it("deletes empty redundant nodes", function() {
        var graph = iD.Graph({
                'a': iD.Node({id: 'a', loc: [0, 0]}),
                'b': iD.Node({id: 'b', loc: [2, 0]}),
                'c': iD.Node({id: 'c', loc: [2, 2]}),
                'd': iD.Node({id: 'd', loc: [1, 2]}),
                'e': iD.Node({id: 'e', loc: [0, 2]}),
                '-': iD.Way({id: '-', nodes: ['a', 'b', 'c', 'd', 'e', 'a']})
            });

        graph = iD.actions.Orthogonalize('-', projection)(graph);

        expect(graph.hasEntity('d')).to.eq(undefined);
    });

    it("preserves non empty redundant nodes", function() {
        var graph = iD.Graph({
                'a': iD.Node({id: 'a', loc: [0, 0]}),
                'b': iD.Node({id: 'b', loc: [2, 0]}),
                'c': iD.Node({id: 'c', loc: [2, 2]}),
                'd': iD.Node({id: 'd', loc: [1, 2], tags: {foo: 'bar'}}),
                'e': iD.Node({id: 'e', loc: [0, 2]}),
                '-': iD.Way({id: '-', nodes: ['a', 'b', 'c', 'd', 'e', 'a']})
            });

        graph = iD.actions.Orthogonalize('-', projection)(graph);
        
        expect(graph.entity('-').nodes).to.have.length(6);
        expect(graph.hasEntity('d')).to.not.eq(undefined);
    });

    it("preserves the shape of skinny quads", function () {
        var tests = [
            [
                [-77.0339864831478, 38.8616391227204],
                [-77.0209775298677, 38.8613609264884],
                [-77.0210405781065, 38.8607390721519],
                [-77.0339024188294, 38.8610663645859]
            ],
            [
                [-89.4706683, 40.6261177],
                [-89.4706664, 40.6260574],
                [-89.4693973, 40.6260830],
                [-89.4694012, 40.6261355]
            ]
        ];

        for (var i = 0; i < tests.length; i++) {
            var graph = iD.Graph({
                    'a': iD.Node({id: 'a', loc: tests[i][0]}),
                    'b': iD.Node({id: 'b', loc: tests[i][1]}),
                    'c': iD.Node({id: 'c', loc: tests[i][2]}),
                    'd': iD.Node({id: 'd', loc: tests[i][3]}),
                    '-': iD.Way({id: '-', nodes: ['a', 'b', 'c', 'd', 'a']})
                }),
                initialWidth = iD.geo.dist(graph.entity('a').loc, graph.entity('b').loc),
                finalWidth;

            graph = iD.actions.Orthogonalize('-', projection)(graph);

            finalWidth = iD.geo.dist(graph.entity('a').loc, graph.entity('b').loc);
            expect(finalWidth / initialWidth).within(0.90, 1.10);
        }
    });
});
