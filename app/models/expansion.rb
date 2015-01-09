class Expansion < ActiveRecord::Base
  has_many :cards

  def booster
    super.split(", ")
  end
end
