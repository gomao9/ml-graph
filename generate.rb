require 'bundler'
Bundler.require

Dotenv.load
Mongo::Logger.logger.level = ::Logger::FATAL

TEAMS = %w(
  レジェンドデイズ
  乙女ストーム！
  エターナルハーモニー
  クレシェンドブルー
  リコッタ
  灼熱少女
  BIRTH
  ミックスナッツ
  ARRIVE
  ミルキーウェイ
)

def mongo
  @mongo ||= Mongo::Client.new(ENV['MONGODB_URI'])
end

def idol_rank_table
  @idol_rank_table ||= mongo['ULA_FINAL_QUEEN']
end

def team_rank_table(no)
  mongo["ULA_FINAL_#{no}"]
end

def team_rank_data(no)
  @team_rank_data ||= []
  @team_rank_data[no] ||= team_rank_table(no).find.sort(time: 1, rank: 1).group_by{|r| r[:time] }
end

def team_border_data(no, rank=146)
  team_rank_table(no).find(rank: rank).sort(time: 1)
end

def to_idol_color id
  765.pro.find_by_id(id).color
end

def to_idol_name id
  765.pro.find_by_id(id).name.shorten
end

def idol_rank_time
  @idol_rank_time ||= idol_rank_table.aggregate([{ '$group': {'_id': "$time", 'max_time': {'$max':  "$time"}}}]).sort_by {|t| t[:max_time].to_s }.map{|t| t[:max_time]}
end

def idols
  @idols ||= idol_rank_table.aggregate([{ '$group': {'_id': "$name", 'name': {'$max':  "$name"}}}]).map{|r| r[:name]}
end

def fullname2idol(fullname)
  765.pro.send({
    '秋月律子'   => :ritsuko,
    '真壁瑞希'   => :mizuki,
    '野々原茜'   => :akane,
    'ジュリア'   => :juria,
    '松田亜利沙' => :arisa,
    '宮尾美也'   => :miya,
    '田中琴葉'   => :kotoha,
    '三浦あずさ' => :azusa,
    '双海真美'   => :mami,
    '高山紗代子' => :sayoko,
    '百瀬莉緒'   => :rio,
  }[fullname])
end

def idol_rank_data
  @idol_rank_data ||= idol_rank_table.find.sort(time: 1).group_by{|r| r[:time] }
    .map{ |time, rs| [time, rs.map { |r| [r[:name], r[:pt]] }.to_h] }
end

def idol_rank_series
  @idol_rank_series = idols.map do |idol|
    [idol,
     idol_rank_data.map{|_, r| r[idol] }]
  end.to_h.merge(time: idol_rank_data.map(&:first))
end

def idol_rank_series_generate
  data = idol_rank_series
  JSON.pretty_generate(xAxis: { categories: data.delete(:time)},
                       series: data.map {|name, pts| { name: name, data: pts, color: fullname2idol(name).color} })
end

def idol_rank_speed(span)
  data = idol_rank_serie  s
  JSON.pretty_generate(xAxis: { categories: data.delete(:time).drop(span)},
                       series: data.map {|name, pts| { name: name, data: speed(pts, span), color: fullname2idol(name).color} })
end

def speed group, span
  group.each_cons(1+span).map do |pts|
    first = pts.first
    last  = pts.last
    (last - first) / span rescue nil
  end
end

def team_rank_result
  data = TEAMS.map.with_index(1) do |team, no|
    rank_data = team_rank_data(no)
    [team, rank_data[rank_data.keys.max].map {|r| r[:point] }]
  end

  JSON.pretty_generate(series: data.map {|name, pts| {name: name, data: [nil] + pts} })
end

def team_time
  team_border_data(1).map{|r| r[:time]}
end

def team_border_series
  time = team_time
  data = TEAMS.map.with_index(1) do |team, no|
    [team, team_border_data(no).map{|r| r[:point]}]
  end
  JSON.pretty_generate(xAxis: { categories: time },
                       series: data.map {|name, pts| {name: name, data: pts}})
end

def team_border_diff
  time = team_time
  data = TEAMS.map.with_index(1) do |team, no|
    diff = team_border_data(no, 146).zip(team_border_data(no, 147)).map{|pts| pts.map{|r| r[:point]}.inject(:-) }
    [team, diff]
  end
  JSON.pretty_generate(xAxis: { categories: time },
                       series: data.map {|name, pts| {name: name, data: pts}})
end

def height_weight_age
  data = Rubimas.all.map do |idol|
    {
      x: idol.height,
      y: idol.weight,
      z: idol.age,
      name: idol.name.full,
      marker: { fillColor: idol.color}
    }
  end
  JSON.pretty_generate(data: data)
end

def bwh
  data = Rubimas.all.map do |idol|
    {
      x: idol.bust,
      y: idol.waist,
      z: idol.hip,
      name: idol.name.full,
      marker: { fillColor: idol.color}
    }
  end
  JSON.pretty_generate(data: data)
end
puts bwh
