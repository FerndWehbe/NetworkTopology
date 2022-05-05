# NetworkTopoly


Ferramente desenvolvida para auxiliar na criação de mapas da topologia de rede.

A pagina inicial da ferramente mostra todas as redes mapeadas.

No Menu de navegação contem 3 opções:

    - Home -> Pagina inicial da aplicação. Lista todas as topologias criadas. Ao clicar você é redirecionado à pagina que desenha a topologia da rede.
    - Criar -> Redireciona para a parte de criação da topologia de rede. Usa um template base contendo somente um nó pai e um nó filho.
    - Desenhar -> Desenha a topologia de rede selecionada. O desenho possui nós (os circulos) e links (as linhas que conectam os nós). Cada nó representa um ativo de rede, por sua vez esse ativo pode receber algumas configurações.
        
        Nome do ativo.
        Localização do ativo.
        Endereço ip.
        Porta de Uplink.
        Porta do no pai que liga ao uplink.
        Id das Vlans que chegam a esse ativo.


        Caso possua mais de uma vlan, adiciona-las em forma de lista, separadas por virgula.
        
        A legenda mostra a cor correspondente ao vlandID.

        É possivel editar uma topologia clicando no botão de editar, que encaminha para a tela de criação porem usando como base o arquivo que estava na visualização.

        O botão Salvar PDF gera um documento do tipo pdf contendo o svg da topologia de da rede.


    - Remover -> Lista todos os arquivos e permite que possam ser apagados do diretorio arquivos_json