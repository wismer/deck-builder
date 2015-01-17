class Expansion < ActiveRecord::Base
  has_many :cards

  def self.filter_by(arg)
    expansion = find(arg[:id]).cards.where(arg[:properties])

    if arg[:not]
      expansion = expansion.where.not(arg[:not])
    end

    expansion
  end

  def draft
    return false if booster.nil?

    card_pool = []
    i = 0
    until card_pool.length == booster.length
      random_card = cards.sample
      if random_card.rarity.downcase == booster[i]
        card_pool << random_card
        i += 1
      end
    end

    return card_pool
  end

  def booster
    super.split(", ") if super
  end
end
