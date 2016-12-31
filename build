#!/usr/bin/env ruby
require "fileutils"
require "pathname"

def add_license(file, version)
  contents = File.read(file)

  File.open(file, "w") do |f|
    f.puts <<PREAMBLE
/**
 * Sinon.JS #{version}, #{Time.now.strftime("%Y/%m/%d")}
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @author Contributors: https://github.com/cjohansen/Sinon.JS/blob/master/AUTHORS
 *
 * #{File.read("LICENSE").split("\n").join("\n * ")}
 */

PREAMBLE

    f.puts(contents)
  end
end

Dir.chdir(File.dirname(__FILE__)) do
  version = File.read("package.json").match(/"version":\s+"(.*)"/)[1]
  version_string = ARGV[0] == "plain" ? "" : "-#{version}"
  output = "pkg/sinon#{version_string}.js"
  browserify = "./node_modules/.bin/browserify"

  FileUtils.mkdir("pkg") unless File.exists?("pkg")
  `#{browserify} -s sinon lib/sinon.js -o #{output}`
  add_license(output, version)

  File.open("pkg/sinon-ie#{version_string}.js", "w") do |f|
    f.puts(File.read("lib/sinon/util-ie/timers.js"))
    f.puts("\n")
    f.puts(File.read("lib/sinon/util-ie/xhr.js"))
    f.puts(File.read("lib/sinon/util-ie/xdr.js"))
  end

  add_license("pkg/sinon-ie#{version_string}.js", version)

  output_server = "pkg/sinon-server#{version_string}.js"
  server_entry_point = "lib/sinon/util/fake_server_with_clock.js"
  simulate_empty_sinon_core = "-i './lib/sinon/util/core.js'"
  `#{browserify} #{server_entry_point} #{simulate_empty_sinon_core} -s sinon -o #{output_server}`

  add_license("pkg/sinon-server#{version_string}.js", version)
  FileUtils.cp(output, 'pkg/sinon.js')
  FileUtils.cp("pkg/sinon-ie#{version_string}.js", 'pkg/sinon-ie.js')
  FileUtils.cp("pkg/sinon-server#{version_string}.js", 'pkg/sinon-server.js')

  puts "Built Sinon.JS #{version}"
end
