import React, { Component } from 'react';
import { Link } from 'react-router';
import Carousel from 'react-image-carousel';


let imageSet = [
  'assets/img/demo/1.png',
  'assets/img/demo/2.png',
  'assets/img/demo/3.png',
  'assets/img/demo/4.png',
  'assets/img/demo/5.png',
  'assets/img/demo/6.png',
  'assets/img/demo/7.png'
];


//  Image url handling is convoluted in scss , much easier to set inline and get images from root
let backgroundStyle = { background: 'url(assets/img/synvisio.jpg)' };

class Home extends Component {
  render() {
    return (
      <div>

        <div className="home-header" style={backgroundStyle}>
          <div className="container-fluid">
            <div className='col-lg-12 text-lg-left text-md-center text-sm-center text-xs-center'><h1>SynVisio</h1>
              <p>An Interactive Multiscale Synteny Visualization Tool for <a href="http://chibba.pgml.uga.edu/mcscan2/">McScanX</a>.</p>
            </div>
          </div>
        </div>

        <div className="container-fluid home-body">

          <h1>How does it work ?</h1>
          <p>SynVisio lets you explore the results of <a href='http://chibba.pgml.uga.edu/mcscan2/'>McScanX</a> a popular synteny and collinearity detection toolkit and generate publication ready images.</p>
          <p>SynVisio requires two files to run:</p>
          <ul>
            <li>The <b>simplified gff file</b> that was used as an input for a McScanX query.</li>
            <li>The <b>collinearity file</b> generated as an output by McScanX for the same input query.</li>
            <li>Optional <b>track file</b> in bedgraph format to annotate the generated charts.</li>
          </ul>
          <p>
            SynVisio offers different types of visualizations such as <b>Linear Parallel plots</b>, <b>Hive plots</b>, <b>Stacked Parallel Plots </b> and <b>Dot plots</b>.
            Users can configure the type of plots required and then choose the source and the target chromosomes that need to be mapped.
            Users also have option to download the generated visualizations in publication ready SVG or PNG formats. </p>

          <p>SynVisio works best when opened in <b>Google chrome.</b></p>

          <h1>Publication Citation</h1>
          <p>Venkat Bandi, and Carl Gutwin. 2020. Interactive Exploration of Genomic Conservation. In Proceedings of the 46th Graphics Interface Conference on Proceedings of Graphics Interface 2020 (GI’20). Canadian Human-Computer Communications Society, Waterloo, CAN.</p>
          <h1>Visualizations generated by SynVisio</h1>
          <div className='carousel-container'>
            <Carousel images={imageSet}
              thumb={false}
              loop={true}
              autoplay={5000} />
          </div>

          <h1>System Demonstration</h1>
          <p> Use the following links for tutorial videos on using SynVisio.
            They might be outdated but will be updated shortly.
            Meanwhile you can drop a mail to venkat.bandi@usask.ca for help with any particular features.</p>
          <p><a href='https://youtu.be/83ep_AuMWak'> Basic Dashboard Demo</a></p>
          <p><a href='https://youtu.be/bLqeXwFDUbQ'> Multi Analysis Hive plot</a></p>
          <p><a href='https://youtu.be/e6CNFLjGFmQ'> Visualizing additional tracks</a></p>
          <p><a href='https://youtu.be/C4fTi9bVHEY'> Detailed description of all features in SynVisio </a></p>


          <h1>Sample Playground</h1>
          <p>We are working on adding several new features to this tool. We have loaded up some sample files below that you can play around with :</p>
          {/*shallow page reload to fix any cache errors*/}
          <ul onClick={(e) => { location.reload(); }}>
            <li> <Link to={'/dashboard/bn'}> B.napus </Link> - Brassica napus , Canola </li>
            <li> <Link to={'/dashboard/bnigra_bol_brapa_ortho'}> B.nigra vs B.oleracea vs B.rapa </Link> - 3 Way comparision between Brassica nigra , Brassica rapa and Brassica oleracea </li>
            <li> <Link to={'/dashboard/ancestor-source'}> B.napus Ancestor </Link> - Mapping of Brassica napus against Ancestral reconstruction </li>
            <li> <Link to={'/dashboard/ta_cs'}> Wheat IWGSC </Link> - Wheat , Chinese Spring (With SNP tracks) </li>
            <li> <Link to={'/dashboard/ta_hb'}> Wheat  Hybrid </Link> - Wheat Hybrid , Artificial Ancestral Hexaplod </li>
            <li> <Link to={'/dashboard/cs_hb'}> Wheat cross way analysis </Link> - Wheat Chinese Spring vs Artificial Ancestral Hexaplod</li>
            <li> <Link to={'/multi-hive'}> Wheat Multi Hive </Link> Multi genome comparision of wheat cultivars through Hive plot matrix </li>
            <li> <Link to={'/dashboard/hs_pt'}> Hs vs Pt </Link> - Hs(Homo sapiens Hg38, Human) vs Pt(Pan troglodytes Pan-tro 3, Chimpanzee)</li>
            <li> <Link to={'/dashboard/at'}> Thale cress </Link> - Arabidopsis thaliana ,Thale cress </li>
            <li> <Link to={'/dashboard/pt'}> Poplar </Link> - Populus trichocarpa ,Poplar </li>
            <li> <Link to={'/dashboard/os_sb'}> Os vs Sb </Link> - Os(Oriza sativa, Rice) vs Sb(Sorghum bicolor , Broom-Corn)</li>
            <li> <Link to={'/dashboard/at_vv'}> At vs Vv </Link> - At(Arabidopsis thaliana, Thale cress) vs Vv(Vitis vinifera , Grape Vine)</li>
            <li> <Link to={'/dashboard/ca_lc_mt'}> Ca vs Lc vs Mt </Link> - 3 Way comparision between Chickpea , Lentils and Barrel Meddick </li>
            <li> <Link to={'/multi-genome'}> Wheat 4 way matrix </Link> Multi genome matrix plot of sub genome D in Wheat.</li>
            <li> <Link to={'/linkage-map'}> Linkage group Lentils </Link> Linkage group mapping in Lentils varieties</li>
          </ul>

          <h1>Learn more</h1>
          <p> This tool was developed at the Human Computer Interaction Lab at the University of Saskatchewan, Canada to assist genome researchers at the Plant Phenotyping and Imaging Research Centre, Canada <a href="https://p2irc.usask.ca/index.php">(P2IRC)</a>.
            This tool is part of series of systems that are currently under development as part of the Theme 3 (Computational Informatics of Crop Phenotype Data) of the P2IRC project.</p>
          <p>Contributions are made by:</p>
          <p><b>Project Lead - </b> Carl Gutwin</p>
          <p><b>System Architect - </b> Venkat Bandi</p>
          <p><b>Research Collaborators - </b>Isobel Parkin, Andrew Sharpe, Kirstin Bett, Larissa Ramsay and Kevin Koh</p>
        </div>
      </div>

    )
  }
};

export default Home;
