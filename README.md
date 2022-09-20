# SynVisio
SynVisio is an interactive multiscale visualization tool that lets you explore the results of McScanX a popular synteny and collinearity detection toolkit and DAGChainer (similar tool).

SynVisio is available for free to use at [https://synvisio.github.io](https://synvisio.github.io).

### SynVisio requires two files to run:
- The simplified gff file that was used as an input for a McScanX query.
- The collinearity file generated as an output by McScanX for the same input query.

General information regarding the parameters that were set for McScanX and the percetage share of collinear genes, are read from the collinearity file and displayed along with the plots. Users can choose the source and the target chromosomes and the type of the plot using a dynamic filter panel and also rearrange the layout of the chromosomes.

### Publication Citation
Please consider citing our work if you are using it in a research publication.

>Venkat Bandi, and Carl Gutwin. 2020. Interactive Exploration of Genomic Conservation. In Proceedings of the 46th Graphics Interface Conference on Proceedings of Graphics Interface 2020 (GI’20). Canadian Human-Computer Communications Society, Waterloo, CAN.

We are looking to add more features to SynVisio. If you have any feature requests or issues if with the current system. Please drop a mail to bvenkatkiran@gmail.com or venkat.bandi@usask.ca.

### Additional Info
Visualization tools for the analysis of conserved regions have not kept pace with the increasing availability of genomic information and the new ways in which this data is being used by biological researchers. To address this gap, we gathered requirements for interactive exploration from three groups of expert genomic scientists at the University of Saskatchewan, and developed SynVisio with novel interaction techniques and visual representations to meet those needs. Our tool supports multi-resolution analysis, provides interactive filtering as researchers move deeper into the genome, supports revisitation to specific interface configurations, and enables loosely-coupled collaboration over the genomic data.

A demo video of the tool is available [here](https://www.youtube.com/watch?v=83ep_AuMWak)

A more descriptive research documention of the development of SynVisio is available [here](https://openreview.net/pdf?id=7-C5VJWbnI)
along with supporting video documentation [here](https://openreview.net/attachment?id=7-C5VJWbnI&name=supplemental_video)

### Example visualizations generated by SynVisio

#### Parallel Linked Plot with Support for Tracks
![parallel_plot](https://github.com/kiranbandi/synvisio/blob/master/build/assets/img/demo/1.png)

#### Visualizations at both the whole genome and the chromosome level
![parallel_plot tracks](https://github.com/kiranbandi/synvisio/blob/master/build/assets/img/demo/2.png)

#### Ability to highlight a gene block and visualize it at the individual gene level
![parallel_orientation](https://github.com/kiranbandi/synvisio/blob/master/build/assets/img/demo/3.png)

#### Multilevel Tree Plot
![Multi Level Tree Plots](https://github.com/kiranbandi/synvisio/blob/master/build/assets/img/demo/4.png)

#### Hive Plot
![Hive Plot](https://github.com/kiranbandi/synvisio/blob/master/build/assets/img/demo/5.png)

#### Dot Plot or a Scatter Plot with support for tracks
![Dot Plot](https://github.com/kiranbandi/synvisio/blob/master/build/assets/img/demo/6.png)

#### 3D Cube Plot
![3D Cube](https://github.com/kiranbandi/synvisio/blob/master/build/assets/img/demo/7.png)

