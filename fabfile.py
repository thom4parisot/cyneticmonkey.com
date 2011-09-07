from datetime import datetime
from os import system
from os import remove as os_remove
from re import sub

css_dir = 'assets/stylesheets'
oocss_dir = css_dir+'/oocss/core'
ycompressor_version = '2.4.6'
build_version = datetime.now().strftime('%Y%M%d%H%m%S')

def build():
    '''
    Builds the non-dev version of the website
    '''
    print("Full build in progress")
    build_static_css()
    build_optimized_css()
    build_optimized_html()

def build_optimized_css():
    '''
    Process CSS by YUICompressor
    '''
    yuicompressor_binpath = '/Users/oncletom/bin/yuicompressor/build/yuicompressor-{0}.jar'.format(ycompressor_version)
    system('java -jar {0} --verbose --nomunge -o {1}/screen.min.css {1}/screen.css'.format(yuicompressor_binpath, css_dir))
    os_remove(css_dir + '/screen.css')

def build_optimized_html():
    '''
    Process HTML
    '''
    stylesheet_html = '<link rel="stylesheet" media="all" type="text/css" href="{0}/screen.{1}.css" />'.format(css_dir, build_version)
    html_content = open('index-dev.html', 'r').read()
    
    html_content = sub('<link rel="stylesheet"[^>]+ \/>', '', html_content)
    html_content = sub(r'(\r?\n?\t<title>)', stylesheet_html+'\g<1>', html_content)
    html_content = sub(r'\n\t\n', '', html_content)
    html_content = sub(r'\n\t+\n', '\n', html_content)
    html_content = sub(r'\n\n', '\n', html_content)
    
    f = open('index.html', 'w')
    f.write(html_content)
    f.close()
    
    return f.closed
    

def build_static_css():
    '''
    Concats all CSS files in one
    @todo: handle this through YUICompressor, as it's handle it since 2.4.6
    '''
    css_content = ''

    for file in get_css_files():
        css_content += open(file, 'r').read()
        
    f = open(css_dir + '/screen.css', 'w')
    f.write(css_content)
    f.close()
    
    return f.closed

def deploy():
    '''
    Deploys files on the remote server
    '''
    print("Deploy")
    
def get_css_files():
    '''
    Returns the list of CSS files used by the website
    '''
    files = []
    files.append(oocss_dir + '/libraries.css')
    files.append(oocss_dir + '/template/template.css')
    files.append(oocss_dir + '/grid/grids.css')
    files.append(oocss_dir + '/content.css')
    files.append(oocss_dir + '/heading/heading.css')
    files.append(oocss_dir + '/spacing/space.css')
    files.append(css_dir + '/screen-dev.css')
    
    return files