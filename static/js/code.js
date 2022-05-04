collapse = (d) => {
    if (d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
    }
}

update = (source) => {
    var treeData = tree(root)

    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1),
        i = 0,
        duration = 250

    recusiveCount(source.data, list_vlans)

    list_vlans = [... new Set(list_vlans)]

    var colors = d3.scaleLinear()
        .range(d3['schemeDark2'])
        .domain(list_vlans)

    nodes.forEach(el => el.depth == 1 ? el.y = 180 : el.y = el.depth * 180)

    var node = svg.selectAll("g.node")
        .data(nodes, d => d.id || (d.id = ++i))

    var nodeEnter = node.enter()
        .append("g")
        .classed("node", true)
        .attr("transform", d => `translate(${source.y0}, ${source.x0})`)
        .on("click", click)

    nodeEnter.append("circle")
        .classed("node", true)
        .style("color", "#14aecc")
        .style("stroke", "steelblue")
        .style("stroke-width", "1.5px")
        .style("fill", "lightsteelblue")
        .attr("r", 8)

    nodeEnter.append("text")
        .attr("id", "namelocation-text")
        .attr("style", "font: 11px sans-serif; fill: black; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;")
        .attr("x", 12)
        .attr("dy", "-0.5em")
        .attr("text-anchor", "start")
        .text(d => {
            if (d.data.Name && d.data.Location) return `${d.data.Name} - ${d.data.Location}`
            if (d.data.Name) return d.data.Name
            if (d.data.Location) return d.data.Location
            return ""
        })

    nodeEnter.append("text")
        .attr("id", "ipaddres-text")
        .attr("style", "font: 11px sans-serif; fill: black; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;")
        .attr("x", 12)
        .attr("y", 18)
        .attr("dy", "-0.5em")
        .attr("text-anchor", "start")
        .text(d => `${d.data.ipaddress ? d.data.ipaddress : ' '}`)

    nodeEnter.append("text")
        .attr("id", "uplink-text")
        .attr("style", "font: 11px sans-serif; fill: black; text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;")
        .attr("x", -24)
        .attr("dy", ".25em")
        .attr("text-anchor", "start")
        .text(d => `${d.data.uplink ? d.data.uplink : " "}`)

    // Update Nodes

    var nodeUpdate = nodeEnter.merge(node)

    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", d => `translate(${d.y}, ${d.x})`);

    //Atualiza os atributos e estilos do nó

    nodeUpdate.select('circle.node')
        .attr('r', 8)
        .attr('cursor', 'pointer');


    nodeUpdate.select('text#namelocation-text')
        .text(d => {
            if (d.data.Name && d.data.Location) return `${d.data.Name} - ${d.data.Location}`
            if (d.data.Name) return d.data.Name
            if (d.data.Location) return d.data.Location
            return ""
        })


    nodeUpdate.select('text#ipaddres-text')
        .text(d => `${d.data.ipaddress ? d.data.ipaddress : ' '}`)

    nodeUpdate.select('text#uplink-text')
        .text(d => `${d.data.uplink ? d.data.uplink : " "}`)



    //Exclui os nós removidos

    var nodeExit = node.exit()
        .transition()
        .duration(duration)
        .attr('transform', d => `translate(${source.y}, ${source.x})`)
        .remove();

    //Reduz o tamanho do nó para 0 antes de remover

    nodeExit.select('circle')
        .attr('r', 0);


    // # ============= Links ============= #

    var link = svg.selectAll('path.link')
        .data(links, d => d.id)

    var linkEnter = link.enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', d => {
            var o = {
                x: source.x0,
                y: source.y0
            }
            return diagonal(o, o)
        })
        .attr("style", "fill: none; stroke-width: 3px;")
        .attr("stroke", d => {
            if(!d.data.vlans) return "#14aecc"
            var node_vlans = d.data.vlans
            if(node_vlans.length == 1) return colors(node_vlans[0])
            return colors(node_vlans[1])
        })

    var linkUpdate = linkEnter.merge(link);

    linkUpdate
        .transition()
        .duration(duration)
        .attr('d', function (d) {
            return diagonal(d, d.parent)
        })

    var linkExit = link.exit()

        .transition()
        .duration(duration)
        .attr('d', function (d) {
            // style_link(linkUpdate)
            var o = {
                x: source.x,
                y: source.y
            }
            return diagonal(o, o)
        })
        .remove();


    nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    })
}

click = (event, d) => {
    selected = d;

    document.querySelector("#add-child").disabled = false;
    document.querySelector("#remove").disabled = false;
    document.querySelector("#edit").disabled = false;
    document.querySelector("#div-edits").style = "display: flex"

    document.querySelector("#name").value = selected.data.Name ? selected.data.Name : " "
    document.querySelector("#location").value = selected.data.Location ? selected.data.Location : " "
    document.querySelector("#ipaddress").value = selected.data.ipaddress ? selected.data.ipaddress : " "
    document.querySelector("#uplink").value = selected.data.uplink ? selected.data.uplink : " "
    document.querySelector("#parent-port").value = selected.data.parentPort ? selected.data.parentPort : " "
    document.querySelector("#vlans").value = selected.data.vlans ? selected.data.vlans : " "


    update(d);
}

diagonal = (s, d) => {

    // O css não conseque aplicar gradiente em paths que não possuem curvaturas.
    // Para solucionar esse problema o if checa se o path é uma linha reta, caso seja
    // É aplicado uma level curvatura no inicio e final do path para enganar o css e aplicar o gradiente. 

    if (`${(s.y + d.y) / 2} ${s.x}` == `${(s.y + d.y) / 2} ${d.x}`) {
        path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x - 0.0011},
                    ${(s.y + d.y) / 2} ${d.x + 0.0011},
                    ${d.y} ${d.x}`
    } else {
        path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`
    }
    return path
}

parseVlans = (value) => {
    var parsed = value.split(",").map(value => parseInt(value.trim()))
    return parsed
}

recusiveCount = (data, list_vlans) => {
    if (data.vlans) {
        data.vlans.forEach(vlan => list_vlans.push(vlan))
    }
    if (data.children) {
        data.children.forEach(el => recusiveCount(el, list_vlans))
    }
}

addChildren = () => {
    var newNodeObj = {
        name: '',
        children: []
    }

    var nodes = svg.selectAll("g.node").data()
    nodes.forEach(el => delete el.id)

    var newNode = d3.hierarchy(newNodeObj)
    newNode.depth = selected.depth + 1;
    newNode.height = selected.height - 1;
    newNode.parent = selected;

    if (!selected.children) {
        selected.children = []
        selected.data.children = []
    }

    selected.children.push(newNode);
    selected.data.children.push(newNode.data)

    update(selected)

    // document.querySelector("#add-child").disabled = true;
    document.querySelector("#remove").disabled = true;
}

editChildren = () => {
    var name = document.querySelector("#name").value.trim() || ""
    var location = document.querySelector("#location").value.trim() || ""
    var ipaddress = document.querySelector("#ipaddress").value.trim() || ""
    var uplink = document.querySelector("#uplink").value.trim() || ""
    var parentPort = document.querySelector("#parent-port").value.trim() || ""
    var vlans = document.querySelector("#vlans").value.trim() || ""


    selected.data.Name = name
    selected.data.Location = location
    selected.data.ipaddress = ipaddress
    selected.data.uplink = uplink
    selected.data.parentPort = parentPort
    selected.data.vlans = parseVlans(vlans)

    update(selected)

    document.querySelector("#edit").disabled = true;
}

removeChildren = () => {
    var newChildren = [];
    var parent = selected.parent
    var parentdata = parent.data

    if (!parent) {
        alert("Não o root não pode ser removido!")
        return
    }

    if (selected.children) selected.children = null
    if (selected.data.children) selected.data.children = null

    parent.children.forEach(child => {
        if (child.id != selected.id)
            newChildren.push(child)
    })

    var index = parentdata.children.indexOf(selected.data)
    parentdata.children.splice(index, 1)

    parent.children = newChildren

    if (parent.children.length === 0) parent.children = null
    if (parentdata.children.length === 0) parentdata.children = null

    update(parent)

    document.querySelector("#add-child").disabled = true;
    document.querySelector("#remove").disabled = true;
    document.querySelector("#edit").disabled = true;
}

saveData = () => {
    var save_name = document.querySelector("#file_name").value

    if (!document.querySelector("#edit").disabled) editChildren()

    let data = d3.selectAll("g.node").data()[0].data
    let datastr = JSON.stringify({
        name: save_name,
        dados: data
    })

    fetch("/save/", {
        method: "POST",
        body: datastr
    }).then(res => console.log(res)).catch(res => console.log(res))
}

exportJson = () => {
    let data = d3.selectAll("g.node").data()[0].data
    let datastr = JSON.stringify(data)
    let dataUri = 'data:application/json;chartset=utf-8,' + encodeURIComponent(datastr)

    let exportFileDefaultName = 'data.json';

    let linkEl = document.createElement('a')
    linkEl.setAttribute('href', dataUri)
    linkEl.setAttribute('download', exportFileDefaultName)
    linkEl.click()
}