from datetime import datetime
from os import system
from os import remove as os_remove
from re import sub
from fabric.api import *
from fabric.contrib.project import rsync_project

env.hosts = ['oncletom']

css_dir = 'assets/stylesheets'
yuicompressor_binpath = '/usr/local/bin/yuicompressor'
bootstrap_dir = 'assets/vendor/bootstrap/docs/assets/css'
build_version = datetime.now().strftime('%Y%M%d%H%m%S')

LOCAL_DIR = '/Users/oncletom/workspace/cyneticmonkey.com/'
REMOTE_DIR = '~/../www_cyneticmonkey'
RSYNC_EXCLUDE = (
    '.project',
    '.settings',
    '.tmp*',
    '.buildpath',
    '.idea',
    '*.py*',
    '*-dev*',
    '.git*',
    '.rsyncignore',
    'bootstrap/js/*',
    '*.less',
    'build',
    'examples',
    '*.mustache'
)

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
    system('{0} --verbose --nomunge -o {1}/screen.min.css {1}/screen.css'.format(yuicompressor_binpath, css_dir))
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
    print("Deploy in progress")
    rsync_project(local_dir=LOCAL_DIR, remote_dir=REMOTE_DIR, exclude=RSYNC_EXCLUDE, extra_opts='--progress --delete-before')


def get_css_files():
    '''
    Returns the list of CSS files used by the website
    '''
    files = []
    files.append(bootstrap_dir + '/bootstrap.css')
    files.append(bootstrap_dir + '/bootstrap-responsive.css')
    files.append(css_dir + '/screen-dev.css')

    return files